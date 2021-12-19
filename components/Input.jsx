import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { HiOutlineCalendar, HiOutlineTag } from 'react-icons/hi'
import { getCategories } from "../functions/content.db";
import LoaderSmall from "./LoaderSmall";

export default function Input({ type, value, onChange, placeholder, selectValues }) {

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
                :
                type === "select" ?
                <>
                    <span className="input-container_label-chooser">{ placeholder }</span>
                    <select className="input-container_chooser" value={value} onChange={e => onChange(e.target.value)}>
                        {
                            selectValues.map(select =>
                                <option key={select.value} value={select.value}>{select.name}</option>
                            )
                        }
                    </select>
                </>
                :
                type === "time" ?
                <>
                    <span className="input-container_label-chooser">{ placeholder }</span>
                    <input value={value} onChange={e => onChange(e.target.value)} type="time" className="input-container_time" />
                </>
                :null
            }
            
        </div>
    )
}
