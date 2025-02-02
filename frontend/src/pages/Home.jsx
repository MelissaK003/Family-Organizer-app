import React from 'react';

export default function Home() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Everything Your Family Needs</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Streamline your family's daily life with powerful features designed to keep everyone organized and in sync.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Task Management */}
          <div className="p-6 bg-neutral-50 rounded-2xl hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Task Management</h3>
            <p className="text-neutral-600">
              Assign and track family tasks with ease. Set reminders and check off completed items together.
            </p>
          </div>

          {/* Shopping Lists */}
          <div className="p-6 bg-neutral-50 rounded-2xl hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Smart Shopping Lists</h3>
            <p className="text-neutral-600">
              Create and share shopping lists in real-time. Never forget an item or buy doubles again.
            </p>
          </div>

          {/* Meal Planning */}
          <div className="p-6 bg-neutral-50 rounded-2xl hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Meal Planning</h3>
            <p className="text-neutral-600">
              Plan weekly meals, share recipes, and generate shopping lists automatically.
            </p>
          </div>

          {/* Event Planning */}
          <div className="p-6 bg-neutral-50 rounded-2xl hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Event Planning</h3>
            <p className="text-neutral-600">
              Organize family events, parties, and gatherings with collaborative planning tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
