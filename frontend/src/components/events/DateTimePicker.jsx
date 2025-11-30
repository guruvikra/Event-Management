import React, { useState } from 'react';
import { formatDisplayDate } from '../../utils/dateUtils.js';
import './DateTimePicker.css';

const DateTimePicker = ({ date, time, onDateChange, onTimeChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const timeInputRef = React.useRef(null);
  
  const [calendarMonth, setCalendarMonth] = useState(() => {
    if (date) {
      return new Date(date).getMonth();
    }
    return new Date().getMonth();
  });
  const [calendarYear, setCalendarYear] = useState(() => {
    if (date) {
      return new Date(date).getFullYear();
    }
    return new Date().getFullYear();
  });

  const handleDateSelect = (selectedDate) => {
    onDateChange(selectedDate);
    setShowCalendar(false);
  };

  const getDisplayDate = () => {
    if (!date) return 'Pick a date';
    return formatDisplayDate(date);
  };

  const generateCalendar = () => {
    const year = calendarYear;
    const month = calendarMonth;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, currentMonth: month, currentYear: year };
  };

  const { days, currentMonth, currentYear } = generateCalendar();

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(calendarYear - 1);
      } else {
        setCalendarMonth(calendarMonth - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(calendarYear + 1);
      } else {
        setCalendarMonth(calendarMonth + 1);
      }
    }
  };
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleTimeClick = () => {
    if (timeInputRef.current) {
      if (timeInputRef.current.showPicker) {
        timeInputRef.current.showPicker();
      } else {
        timeInputRef.current.focus();
      }
    }
  };

  return (
    <div className="datetime-picker">
      <div className="datetime-inputs">
        <div className="date-input-wrapper">
          <button
            type="button"
            className="date-input"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span className="date-icon">📅</span>
            <span className="date-text">{getDisplayDate()}</span>
          </button>
          
          {showCalendar && (
            <>
              <div className="calendar-overlay" onClick={() => setShowCalendar(false)} />
              <div className="calendar-dropdown">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="nav-btn"
                    onClick={() => navigateMonth('prev')}
                  >
                    ‹
                  </button>
                  <div className="month-year-selector">
                    <select 
                      className="month-select"
                      value={currentMonth}
                      onChange={(e) => setCalendarMonth(parseInt(e.target.value))}
                    >
                      {monthNames.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                    <select 
                      className="year-select"
                      value={currentYear}
                      onChange={(e) => setCalendarYear(parseInt(e.target.value))}
                    >
                      {Array.from({length: 10}, (_, i) => currentYear - 2 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="nav-btn"
                    onClick={() => navigateMonth('next')}
                  >
                    ›
                  </button>
                </div>

                <div className="calendar-actions">
                  <button
                    type="button"
                    className="today-btn"
                    onClick={() => {
                      const today = new Date();
                      setCalendarMonth(today.getMonth());
                      setCalendarYear(today.getFullYear());
                      handleDateSelect(today.toISOString().split('T')[0]);
                    }}
                  >
                    Today
                  </button>
                </div>
                
                <div className="calendar-grid">
                  <div className="weekdays">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>
                  
                  <div className="days-grid">
                    {days.map((day, index) => {
                      const isCurrentMonth = day.getMonth() === currentMonth;
                      const isSelected = date === day.toISOString().split('T')[0];
                      const isToday = day.toDateString() === new Date().toDateString();
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          className={`day-btn ${isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                          onClick={() => handleDateSelect(day.toISOString().split('T')[0])}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="time-input-wrapper">
          <span className="time-icon">🕐</span>
          <input
            ref={timeInputRef}
            type="time"
            className="time-input"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
          <div className="time-display-main" onClick={handleTimeClick}>
            {time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }) : '12:00 AM'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;