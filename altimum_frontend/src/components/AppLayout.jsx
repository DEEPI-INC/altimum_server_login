// 1. 필요한 React 훅(useState, useEffect, useRef)을 모두 임포트합니다.
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RectangleStackIcon, HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  // 2. 드롭다운 메뉴의 '열림/닫힘' 상태를 기억하기 위한 useState를 다시 추가합니다.
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 3. 드롭다운 메뉴 바깥을 클릭했을 때 메뉴를 닫는 로직을 다시 추가합니다.
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex h-screen">
      <aside className="hidden w-64 bg-white border-r border-gray-200 lg:block dark:bg-gray-900 dark:border-gray-700">
        {/* ... (사이드바 코드는 이전과 동일) ... */}
        <div className='px-6 py-4'>
            <Link to="/" className="text-xl font-semibold dark:text-white">ProtoType</Link>
        </div>
        <nav className="px-2 space-y-1">
            <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium dark:text-white ${isActive('/') ? 'bg-gray-200 dark:bg-gray-700 dark:text-[#646cff]' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <HomeIcon className="w-5 h-5" /> First
            </Link>
            <Link to="/Second" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium dark:text-white ${isActive('/Second') ? 'bg-gray-200 dark:bg-gray-700 dark:text-[#646cff]' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <RectangleStackIcon className="w-5 h-5" /> Second
            </Link>
            <Link to="/Third" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium dark:text-white ${isActive('/Third') ? 'bg-gray-200 dark:bg-gray-700 dark:text-[#646cff]' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Cog6ToothIcon className="w-5 h-5" /> Third
            </Link>
        </nav>
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="w-full h-16 flex items-center justify-between p-4 bg-white border-b dark:bg-gray-900 dark:border-gray-700">
          <div className="flex items-center gap-3">{/* Mobile menu placeholder */}</div>
          <div className="flex items-center">
            {isAuthenticated ? (
              // 로그인 상태일 때: 프로필 드롭다운
              <div className="relative" ref={dropdownRef}>
                {/* 4. 프로필 이미지를 클릭하면 open 상태가 바뀌도록 onClick 이벤트를 다시 추가합니다. */}
                <UserCircleIcon
                    className="w-8 h-8 text-gray-700 dark:text-white cursor-pointer"
                    onClick={() => setOpen(!open)}
                    />
                {/* 5. open 상태가 true일 때만 드롭다운 메뉴를 보여줍니다. */}
                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">My Account</a>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 md:px-8 bg-gray-50 dark:bg-gray-800/50">
          {children}
        </main>
      </div>
    </div>
  );
}