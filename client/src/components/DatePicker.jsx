import React, { useState } from 'react';
import '../styles/DatePicker.css';

const DatePicker = ({ label, initialDate, onChange, minDate }) => {
  const [date, setDate] = useState(initialDate || '');

  const handleChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    onChange && onChange(newDate);
  };

  // Format today's date as YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="date-picker">
      <label>{label}</label>
      <input
        type="date"
        value={date}
        onChange={handleChange}
        min={minDate || today}
        required
      />
    </div>
  );
};

export default DatePicker;
