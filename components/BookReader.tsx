import React, { useState, useMemo, useEffect } from 'react';
import { LibraryBook, ReadingProgress, BookReview, User } from '../types';
import { XIcon, StarIcon } from '../constants';

interface BookReaderProps {
    book: LibraryBook;
    progress: ReadingProgress | undefined;
    currentUser: User;
    onClose: () => void;
    onProgressUpdate: (bookId: string, currentPage: number) => void;
    onCreateReview: (reviewData: Omit<BookReview, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
}

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'}`}
            >
                <StarIcon className="w-7 h-7" />
            </button>
        ))}
    </div>
);


export const BookReader: React.FC<BookReaderProps> = ({ book, progress, currentUser, onClose, onProgressUpdate, onCreateReview }) => {
    const [currentPage, setCurrentPage] = useState(progress?.currentPage || 0);
    const [pageInput, setPageInput] = useState((progress?.currentPage || 0) + 1);
    
    // Review form state
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');

    const pages = useMemo(() => book.content.split('PAGE_BREAK'), [book.content]);
    const totalPages = pages.length;

    const averageRating = useMemo(() => {
        if (!book.ratings || book.ratings.length === 0) return 0;
        return book.ratings.reduce((acc, r) => acc + r, 0) / book.ratings.length;
    }, [book.ratings]);

    const hasUserReviewed = useMemo(() => {
        return book.reviews?.some(r => r.userId === currentUser.id);
    }, [book.reviews, currentUser.id]);

    useEffect(() => {
        // This effect runs when the component unmounts, saving the progress.
        return () => {
            onProgressUpdate(book.id, currentPage);
        };
    }, [book.id, currentPage, onProgressUpdate]);

    const goToPage = (pageNumber: number) => {
        const newPage = Math.max(0, Math.min(pageNumber, totalPages - 1));
        setCurrentPage(newPage);
        setPageInput(newPage + 1);
    };
    
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(Number(e.target.value));
    };

    const handlePageInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        goToPage(pageInput - 1);
    };
    
    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating > 0 && userComment.trim() !== '') {
            onCreateReview({
                bookId: book.id,
                rating: userRating,
                comment: userComment,
            });
            setUserRating(0);
            setUserComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 truncate">{book.title}</h2>
                        <p className="text-sm text-slate-500">by {book.author}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XIcon /></button>
                </header>
                
                <div className="flex-grow flex flex-col lg:flex-row h-0">
                    {/* Reader Panel */}
                    <div className="w-full lg:w-2/3 flex flex-col h-1/2 lg:h-full">
                        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-slate-50">
                            <div className="prose max-w-none text-base md:text-lg leading-relaxed">
                                <p className="whitespace-pre-wrap">{pages[currentPage]}</p>
                            </div>
                        </main>
                        
                        <footer className="p-4 border-t bg-white flex justify-between items-center shrink-0">
                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 disabled:opacity-50">Previous</button>
                            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 text-sm">
                                Page
                                <input type="number" value={pageInput} onChange={handlePageInputChange} onBlur={() => goToPage(pageInput - 1)} min={1} max={totalPages} className="w-16 text-center border-slate-300 rounded-md"/>
                                of {totalPages}
                            </form>
                             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 disabled:opacity-50">Next</button>
                        </footer>
                    </div>
                    {/* Review Panel */}
                     <aside className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l flex flex-col h-1/2 lg:h-full">
                         <div className="p-6 space-y-4 overflow-y-auto">
                            <img src={book.coverImage} alt={book.title} className="w-full h-auto object-contain rounded-md shadow-lg" />
                            <div>
                                <h3 className="text-lg font-bold">Reviews & Ratings</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-lg font-bold text-yellow-500">{averageRating.toFixed(1)}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-300'}`} />)}
                                    </div>
                                    <span className="text-sm text-slate-500">({book.ratings?.length || 0} ratings)</span>
                                </div>
                            </div>
                            
                            {!hasUserReviewed ? (
                                <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 border rounded-lg space-y-3">
                                    <h4 className="font-semibold text-slate-800">Leave a Review</h4>
                                    <StarRatingInput rating={userRating} setRating={setUserRating} />
                                    <textarea value={userComment} onChange={e => setUserComment(e.target.value)} required placeholder="Share your thoughts..." rows={3} className="w-full border-slate-300 rounded-md shadow-sm text-sm"></textarea>
                                    <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 disabled:bg-slate-300" disabled={!userRating || !userComment}>Submit Review</button>
                                </form>
                            ) : (
                                <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-center text-sm font-semibold">
                                    You've already reviewed this book.
                                </div>
                            )}

                             <div className="space-y-4">
                                {(book.reviews || []).map(review => (
                                    <div key={review.id} className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-sm text-slate-800">{review.userName}</p>
                                            <div className="flex">
                                                 {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} />)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">{review.comment}</p>
                                    </div>
                                ))}
                             </div>
                         </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};