import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <header className='header'>
            <Link href={'/'} className='flex items-center gap-2'></Link>
        </header>
    )
}

export default page
