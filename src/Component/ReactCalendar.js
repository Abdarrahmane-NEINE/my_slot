import "./index.css";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ReactCalendar() {
  const [value, onChange] = useState(new Date());
  return (
    <div className="App">
      <h1>test tewt</h1>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}
