// app/timeline/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Clock, CalendarPlus, Filter } from 'lucide-react';
import { ELECTION_TIMELINE } from '@/lib/electionData';
import toast from 'react-hot-toast';

export default function TimelinePage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'current' | 'upcoming'>('all');

  const filteredTimeline = useMemo(() => {
    if (filter === 'all') return ELECTION_TIMELINE;
    return ELECTION_TIMELINE.filter(e => e.status === filter);
  }, [filter]);

  const handleAddToCalendar = (event: typeof ELECTION_TIMELINE[0]) => {
    // Generate a basic .ics file for the event
    // Note: Since we only have month/year in data, we default to the 1st of that month
    try {
      const monthStr = event.date.split(' ')[0];
      const yearStr = event.date.split(' ')[1];
      const monthMap: Record<string, string> = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      
      const mm = monthMap[monthStr] || '01';
      const startString = `${yearStr}${mm}01T090000`;
      const endString = `${yearStr}${mm}01T180000`; // 9am to 6pm

      const icsData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}\\n\\nvia Election AI Assistant
DTSTART:${startString}
DTEND:${endString}
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title.replace(/\\s+/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Event downloaded!');
    } catch {
      toast.error('Failed to create calendar event.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgb(139,92,246,0.3)]">
          <Calendar size={32} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Election Timeline</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Track all key milestones from voter registration to result announcement. Stay updated with the official schedule.
        </p>
      </div>

      {/* Filters & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter size={16} className="text-gray-400 mr-1" />
          {[
            { id: 'all', label: 'All Events' },
            { id: 'completed', label: 'Completed' },
            { id: 'current', label: 'Current Phase' },
            { id: 'upcoming', label: 'Upcoming' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4 text-xs font-medium bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-full sm:w-auto justify-center">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Done</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Active</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Next</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - hidden on small mobile, visible sm and up */}
        <div className="hidden sm:block absolute left-9 top-4 bottom-4 w-1 bg-gradient-to-b from-green-400 via-blue-400 to-gray-200 rounded-full opacity-50" />

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredTimeline.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-400"
              >
                No events found for this filter.
              </motion.div>
            ) : (
              filteredTimeline.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0 hidden sm:flex justify-center w-20">
                    <div
                      className={`w-14 h-14 rounded-2xl ${event.color} flex items-center justify-center shadow-md ${
                        event.status === 'current' ? 'ring-4 ring-blue-200 ring-offset-2 animate-pulse-ring' : ''
                      }`}
                    >
                      <span className="text-2xl">{event.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 bg-white p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                      event.status === 'current'
                        ? 'border-blue-400 shadow-blue-100 shadow-xl transform scale-[1.02]'
                        : event.status === 'completed'
                        ? 'border-green-100'
                        : 'border-gray-100 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Mobile Icon */}
                        <span className="sm:hidden text-2xl mr-1">{event.icon}</span>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            event.status === 'current'
                              ? 'bg-blue-100 text-blue-800'
                              : event.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {event.date}
                        </span>
                        
                        {event.status === 'completed' && (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}
                        {event.status === 'current' && (
                          <span className="flex items-center gap-1 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                            <Clock size={14} /> Active Phase
                          </span>
                        )}
                        {event.status === 'upcoming' && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
                            <Circle size={14} /> Upcoming
                          </span>
                        )}
                      </div>
                      
                      {event.status !== 'completed' && (
                        <button 
                          onClick={() => handleAddToCalendar(event)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors border border-purple-100 w-fit"
                        >
                          <CalendarPlus size={14} /> Add to Calendar
                        </button>
                      )}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${event.status === 'current' ? 'text-blue-900' : 'text-gray-900'}`}>
                      {event.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${event.status === 'current' ? 'text-gray-700' : 'text-gray-500'}`}>
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-blue-50 rounded-2xl border border-blue-100 p-6 shadow-sm"
      >
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" /> Official Schedule
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          The dates provided above are indicative and based on general election cycles. Official election schedules are announced by the Election Commission of India (ECI) via press conferences. Always verify the exact dates for your constituency at{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer"
            className="font-bold underline hover:text-blue-600 transition-colors">eci.gov.in</a>{' '}
          or call the Voter Helpline at <strong className="bg-white px-1.5 rounded">1950</strong>.
        </p>
      </motion.div>
    </div>
  );
}
