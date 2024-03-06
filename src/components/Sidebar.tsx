"use client"

import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

const Sidebar = () => {
    const pathname = usePathname()

    return (
        <aside className='sidebar'>
            <div className="flex flex-col size-full">
                <Link href="/" className='sidebar-logo'>
                    Pixel Wizards AI
                </Link>

                <nav className='sidebar-nav'>
                    <SignedIn>
                        <ul className='sidebar-nav_elements'>
                            {navLinks?.slice(0, 6)?.map((link, index) => {
                                const isActive = pathname === link.route

                                return (
                                    <li key={index} className={`sidebar-nav_element ${isActive ? 'bg-orange-gradient text-white' : 'text-gray-700'}`}>
                                        <Link className='sidebar-link' href={link.route} >
                                            <Image
                                                src={`${link.icon}`}
                                                width={24}
                                                height={24}
                                                alt={link.label}
                                                className={`${isActive && 'brightness-200'}`}
                                            />
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="bg-gray-300 h-[0.12rem] w-full"></div>


                        <ul className='sidebar-nav_elements'>
                            {navLinks?.slice(6)?.map((link, index) => {
                                const isActive = pathname === link.route

                                return (
                                    <li key={index} className={`sidebar-nav_element ${isActive ? 'bg-orange-gradient text-white' : 'text-gray-700'}`}>
                                        <Link className='sidebar-link' href={link.route} >
                                            <Image
                                                src={`${link.icon}`}
                                                width={24}
                                                height={24}
                                                alt={link.label}
                                                className={`${isActive && 'brightness-200'}`}
                                            />
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                            <li className='flex items-center cursor-pointer gap-2 p-4'>
                                <UserButton afterSignOutUrl='/' showName />
                            </li>
                        </ul>

                    </SignedIn>

                    <SignedOut>
                        <Button asChild className='bg-orange-gradient button bg-cover'>
                            <Link href="/sign-in">
                                Sign In
                            </Link>
                        </Button>
                    </SignedOut>
                </nav>
            </div>
        </aside>
    )
}

export default Sidebar
