import React, { useState, useMemo } from 'react';
import { User, LibraryBook, ReadingProgress, UserRole, VisitorPayment, BookRequest } from '../types';
import { SearchIcon, PlusCircleIcon, LightBulbIcon, Cog6ToothIcon, StarIcon } from '../constants';

interface LibraryViewProps {
    currentUser: User;
    books: LibraryBook[];
    readingProgress: ReadingProgress[];
    visitorPayments: VisitorPayment[];
    bookRequests: BookRequest[];
    onOpenReader: (book: LibraryBook, progress: ReadingProgress | undefined) => void;
    onOpenUploader: () => void;
    onUpdateProgress: (bookId: string, currentPage: number) => void;
    onInitiatePayment: () => void;
    onOpenRequestForm: () => void;
    onOpenRequestManager: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400"/>)}
            {/* Not implementing half-star for simplicity, can be added later */}
            {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-slate-300"/>)}
        </div>
    );
}

const BookCard: React.FC<{ book: LibraryBook; progress: ReadingProgress | undefined; onRead: () => void; }> = ({ book, progress, onRead }) => {
    const averageRating = useMemo(() => {
        if (!book.ratings || book.ratings.length === 0) return 0;
        return book.ratings.reduce((acc, r) => acc + r, 0) / book.ratings.length;
    }, [book.ratings]);
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-shadow hover:shadow-xl">
            <div className="h-56 bg-slate-200 flex items-center justify-center">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover"/>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <p className="text-xs text-slate-500 font-semibold uppercase">{book.category}</p>
                <h3 className="text-lg font-bold text-slate-800 truncate">{book.title}</h3>
                <p className="text-sm text-slate-500">by {book.author}</p>
                
                 <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={averageRating} />
                    <span className="text-xs text-slate-400">({book.ratings?.length || 0})</span>
                </div>

                {progress && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                        Last read: Page {progress.currentPage + 1}
                    </p>
                )}
                
                <p className="text-sm text-slate-600 mt-2 line-clamp-2 flex-grow">{book.description}</p>
                
                <button 
                    onClick={onRead}
                    className="w-full mt-4 bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    {progress ? 'Continue Reading' : 'Start Reading'}
                </button>
            </div>
        </div>
    );
};

export const LibraryView: React.FC<LibraryViewProps> = (props) => {
    const { currentUser, books, readingProgress, visitorPayments, bookRequests, onOpenReader, onOpenUploader, onInitiatePayment, onOpenRequestForm, onOpenRequestManager } = props;
    const [searchTerm, setSearchTerm] = useState('');

    const canManage = currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.ICT_STAFF;

    const hasVisitorPaid = useMemo(() => {
        if (currentUser.role !== UserRole.VISITOR) return true; // Non-visitors don't need to pay
        return visitorPayments.some(p => p.visitorId === currentUser.id && p.feeType === 'library_access');
    }, [currentUser, visitorPayments]);
    
    const filteredBooks = useMemo(() => {
        return books.filter(b => 
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [books, searchTerm]);

    const handleReadClick = (book: LibraryBook) => {
        if (!hasVisitorPaid) {
            if(window.confirm("You need to pay a one-time fee to access the library. Proceed to payment?")) {
                onInitiatePayment();
            }
        } else {
            const progress = readingProgress.find(p => p.userId === currentUser.id && p.bookId === book.id);
            onOpenReader(book, progress);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Digital Library</h2>
                <div className="flex items-center gap-2">
                    {currentUser.role !== UserRole.TEACHER && (
                         <button onClick={onOpenRequestForm} className="bg-white border border-yellow-500 text-yellow-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-50 transition">
                            <LightBulbIcon className="w-5 h-5"/>
                            <span>Request a Book</span>
                        </button>
                    )}
                    {canManage && (
                        <>
                            <button onClick={onOpenRequestManager} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-100 transition">
                                <Cog6ToothIcon className="w-5 h-5"/>
                                <span>Manage Requests ({bookRequests.filter(r => r.status === 'Pending').length})</span>
                            </button>
                            <button onClick={onOpenUploader} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <span>Upload Book</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 bg-white rounded-lg shadow-sm border">
                <div className="relative w-full md:w-2/5">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400" /></div>
                    <input type="text" placeholder="Search by title, author, or category..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full"/>
                </div>
            </div>

             {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks.map(book => {
                    const progress = readingProgress.find(p => p.bookId === book.id && p.userId === currentUser.id);
                    return (
                        <BookCard key={book.id} book={book} progress={progress} onRead={() => handleReadClick(book)} />
                    );
                })}
            </div>
            {filteredBooks.length === 0 && <p className="text-slate-500 text-center col-span-full py-12">No books found matching your search.</p>}
        </div>
    );
};