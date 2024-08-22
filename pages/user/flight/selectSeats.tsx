import Navbar from '@/pages/components/Navbar';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setSeats } from '@/redux/slices/seatSlice';

const SelectSeats: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const seats = useSelector((state: RootState) => state.seats.seats);
    const [selectedSeat, setSelectedSeat] = useState<any>(null);
    const seatDetailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await fetch('/api/getSeats');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched seats data:', data.getSeats);
                dispatch(setSeats(data || []));
            } catch (error: any) {
                console.error('Error fetching seats:', error.message);
            }
        };

        fetchSeats();
    }, [dispatch]);

    const handleSeatClick = (seat: any) => {
        setSelectedSeat(seat);
        if (seatDetailsRef.current) {
            seatDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    console.log('Redux seats state:', seats);

    return (
        <>
            <Navbar />
            <div className='relative flex justify-center mt-[150px] items-center min-h-screen'>
                <Image src='/Ticket_layout.png' width={900} height={1000} alt='Ticket layout' />
                {seats.length > 0 ? (
                    seats.map((seat, index) => (
                        <div
                            key={index}
                            className='absolute ml-[670px] mt-[70px] flex justify-center items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer'
                            style={{ top: `${seat.y}px`, left: `${seat.x}px` }}
                            onClick={() => handleSeatClick(seat)}
                        >
                            <svg
                                className='w-8 h-12'
                                fill={seat.isBooked ? 'red' : 'dark'}
                                width='15'
                                height='15'
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                            >
                                <path d="M64 160C64 89.3 121.3 32 192 32l256 0c70.7 0 128 57.3 128 128l0 33.6c-36.5 7.4-64 39.7-64 78.4l0 48-384 0 0-48c0-38.7-27.5-71-64-78.4L64 160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48l0 176c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L96 448c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L0 272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3l0 48 0 32 32 0 384 0 32 0 0-32 0-48z"/>
                            </svg>
                        </div>  
                    ))
                ) : (
                    <p>No seats available</p>
                )}
            </div>
            {selectedSeat && (
                <div ref={seatDetailsRef} className='mt-4 p-4 w-[350px] h-[200px] bg-white/10 border border-white/10 rounded shadow-md'>
                    <h3 className='text-3xl text-white  font-extrabold'>Selected Seat Details:</h3>
                    <p className='font-semibold  text-white text-2xl'>SeatNumber: {selectedSeat.row}{selectedSeat.col}</p>
                    
                    <p className='font-semibold  text-white text-2xl'>Class: {selectedSeat.class}</p>
                </div>
            )}
        </>
    );
}

export default SelectSeats;
