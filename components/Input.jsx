import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { HiOutlineCalendar } from 'react-icons/hi'

export default function Input({ type, value, onChange, placeholder }) {

    const [calendarToggle, setCalendarToggle] = useState(false)
    const calendarRef = useRef()

    useEffect(() => {
        
        if(type === "date") {
            if(calendarRef.current) {
                calendarRef.current.addEventListener('mouseleave', handleCalendarMouseOut)
            }

        }

        return () => {
            if(calendarRef.current) {
                calendarRef.current.removeEventListener('mouseleave', handleCalendarMouseOut)
            }
        }
    }, [])

    const handleCalendarMouseOut = () => {
        setCalendarToggle(false)
    }
        
    return (
        <div className="input-container">

            {
                type === "text" ?
                <>
                    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input-container_input" placeholder=" "/>
                    <span className="input-container_label">{ placeholder }</span>
                </>
                :
                type === "password" ?
                <>
                    <input type="password" value={value} onChange={(e) => onChange(e.target.value)} className="input-container_input" placeholder=" "/>
                    <span className="input-container_label">{ placeholder }</span>
                </>
                :
                type === "date" ?
                <>
                    <Calendar className={ calendarToggle === true ? "input-container_calendar":"input-container_calendar input-container_calendar-hidden" }
                        onChange={val => {
                            setCalendarToggle(false)
                            onChange(val)
                        }}
                        inputRef={calendarRef}
                        />
                    <span className="input-container_calendar-label">{ placeholder }</span>
                    <button className="input-container_calendar-toggle" onClick={ () => setCalendarToggle(calendarToggle === true ? false:true) }>
                        <HiOutlineCalendar />
                        <span>Choisir</span>
                    </button>
                </>
                :null
            }
            
        </div>
    )
}
