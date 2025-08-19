import {useNavigate} from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();

  return (
    <div className="relative isolate px-6 pt-5 lg:px-8">
      <div className="mx-auto max-w-3xl py-32 sm:py-40 lg:py-48">
        <div className="text-center">
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Firebase Authentication Template
          </h1>

         
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Login, Sign Up, and Logout are ready to use—built with React + TypeScript,
            Firebase Authentication, Firestore, and Tailwind CSS.
          </p>

         
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              React + TypeScript
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Firebase Auth
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Firestore
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Tailwind CSS
            </span>
          </div>

         
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              onClick={() => navigate('/login') }
              className="cursor-pointer rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Get started
            </a>
            <a
              href="https://github.com/fredabel/firebase-auth-template" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              aria-label="View source on GitHub"
            >
              
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                <path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.63 5.47 7.71.4.08.55-.18.55-.4 0-.2-.01-.87-.01-1.58-2.01.37-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.16-.28-.15-.68-.52-.01-.53.63-.01 1.08.6 1.23.85.72 1.22 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.2-3.64-.92-3.64-4.08 0-.9.31-1.64.83-2.21-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.85.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.07 2.2-.85 2.2-.85.45 1.1.16 1.92.08 2.12.52.57.83 1.31.83 2.21 0 3.17-1.87 3.88-3.65 4.08.29.26.54.77.54 1.55 0 1.12-.01 2.02-.01 2.29 0 .22.15.48.55.4A8.05 8.05 0 0 0 16 8.13C16 3.64 12.42 0 8 0z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
