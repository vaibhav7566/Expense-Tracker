import React, { useState } from 'react'
import { DollarSign, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    // console.log(user);

    return (
        <>
            <nav className={`w-full z-50 transition-all duration-300 `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center space-x-2">
                            <div >
                                {/* <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" /> */}
                                <img src="/logo.png " className="w-8 h-8 sm:w-10 sm:h-10 rounded-md" alt="" />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                                ExpenseFlow
                            </span>
                        </div>



                        <div className="hidden md:flex space-x-4">

                            {user?.user !== null ? <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all" onClick={() => navigate('/dashboard')}
                            > Dashboard  </button> : <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all" onClick={() => navigate('/signin')}> Sign In </button>}
                        </div>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-black/95 backdrop-blur-lg">
                        <div className="px-4 pt-2 pb-4 space-y-3">

                            {user?.user ? <button className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all" onClick={() => navigate('/dashboard')}> Dashboard </button> : <button onClick={() => navigate('/signin')} className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">Sign In</button>}


                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar