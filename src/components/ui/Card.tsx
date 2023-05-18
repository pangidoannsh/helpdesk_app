import React, { ReactNode, Ref, RefObject } from 'react'

interface CardProps {
    children: ReactNode;
    className?: string;
    refrence?: RefObject<any>;
    backgroundColor?: string;
    onClick?: (e: any) => void
}
export default function Card(props: CardProps) {

    return (
        <div className={`${props.className} ${props.backgroundColor ?? 'bg-white'} shadow-card
        ${props.onClick ? 'cursor-pointer' : ''}`}
            ref={props.refrence ? props.refrence : null} onClick={props.onClick}>
            {props.children}
        </div>
    )
}
