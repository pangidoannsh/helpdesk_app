import { Icon } from '@iconify/react';
import React, { ReactNode } from 'react'

interface ColumnObj {
    header: string;
    field: string;
    width?: string;
    align?: string;
    className?: string;
}
interface TableProps {
    column: Array<ColumnObj>;
    dataBody: Array<any>;
    loading?: boolean;
    emptyDataMessage?: string;
}
export default function Table(props: TableProps) {
    const { dataBody, column, loading, emptyDataMessage } = props;
    return (
        <table className='table-auto w-full'>
            <thead>
                <tr>
                    {column.map(col => (
                        <th key={col.field} className={`table-header ${col.align ? 'text-' + col.align : 'text-start'}`}
                            style={{ width: col.width ?? 'auto' }}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {!loading ?
                    dataBody.length !== 0 ?
                        dataBody.map((dataRow, index) => (
                            <tr key={index} className="hover:bg-primary-500/5">
                                {column.map(col => (
                                    <td key={col.field}
                                        className={`${col.className ?? 'table-body'} ${col.align ? 'text-' + col.align : 'text-start'}`}>
                                        {dataRow[col.field]}
                                    </td>
                                ))}
                            </tr>
                        )) :
                        <tr>
                            <td colSpan={column.length} className='text-center text-sm p-4 bg-slate-50 text-slate-500'>
                                {emptyDataMessage ? emptyDataMessage : 'Data Kosong'}
                            </td>
                        </tr>
                    : (
                        <tr>
                            <td colSpan={column.length} className="p-4">
                                <div className="flex justify-center items-center">
                                    <Icon icon="eos-icons:loading" className='text-6xl text-primary-700' />
                                </div>
                            </td>
                        </tr>
                    )}
            </tbody>
        </table>
    )
}
