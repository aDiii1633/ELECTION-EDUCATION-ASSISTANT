// app/timeline/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import { ELECTION_TIMELINE } from '@/lib/electionData';

export default function TimelinePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Calendar size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Timeline</h1>
        <p className="text-gray-500">
          Track all key milestones from registration to result announcement.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
        {[
          { color: 'bg-green-500', label: 'Completed' },
          { color: 'bg-blue-500', label: 'Current Phase' },
          { color: 'bg-gray-300', label: 'Upcoming' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-gray-600 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-gray-200" />

        <div className="space-y-6">
          {ELECTION_TIMELINE.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="relative flex gap-4"
            >
              {/* Timeline dot */}
              <div className="relative z-10 shrink-0">
                <div
                  className={`w-14 h-14 rounded-2xl ${event.color} flex items-center justify-center shadow-md ${
                    event.status === 'current' ? 'ring-4 ring-blue-200 animate-pulse-ring' : ''
                  }`}
                >
                  <span className="text-xl">{event.icon}</span>
                </div>
              </div>

              {/* Content */}
              <div
                className={`flex-1 card-backlit p-4 sm:p-5 transition-all duration-200 ${
                  event.status === 'current'
                    ? 'border-blue-200 shadow-blue-100 shadow-md'
                    : event.status === 'completed'
                    ? 'border-green-100'
                    : 'border-gray-100 opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      event.status === 'current'
                        ? 'bg-blue-100 text-blue-700'
                        : event.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {event.date}
                  </span>
                  {event.status === 'completed' && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <CheckCircle2 size={13} /> Done
                    </span>
                  )}
                  {event.status === 'current' && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                      <Clock size={13} /> In Progress
                    </span>
                  )}
                  {event.status === 'upcoming' && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                      <Circle size={13} /> Upcoming
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 bg-blue-50 rounded-2xl border border-blue-100 p-5"
      >
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Calendar size={16} /> Stay Updated
        </h3>
        <p className="text-sm text-blue-700">
          Election schedules are officially announced by the Election Commission of India (ECI).
          Always verify dates at{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer"
            className="font-semibold underline">eci.gov.in</a>{' '}
          or through the official Voter Helpline{' '}
          <strong>1950</strong>.
        </p>
      </motion.div>
    </div>
  );
}
