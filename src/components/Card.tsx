import React, { ReactNode, Ref, RefObject } from 'react'

interface CardProps {
    children: ReactNode;
    className?: string;
    refrence?: RefObject<any>;
    backgroundColor?: string;
}
export default function Card(props: CardProps) {

    return (
        <div className={`${props.className} ${props.backgroundColor ?? 'bg-white'} shadow-card`}
            ref={props.refrence ? props.refrence : null}>
            {props.children}
        </div>
    )
}
