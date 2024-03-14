import { getUserById } from '@/actions/userActions'
import Header from '@/components/Header'
import TransformationForm from '@/components/TransformationForm'
import { transformationTypes } from '@/constants'
import { SearchParamProps, TransformationTypeKey } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({ params: { type } }: SearchParamProps) => {
    // console.log(type)
    const transformation = transformationTypes[type]
    const { userId } = auth()

    if (!userId) redirect('/sign-in')

    const user = await getUserById(userId)
    // console.log(user)

    return (
        <div>
            <Header title={transformation.title} subtitle={transformation.subTitle} />
            <section className='mt-10'>
                <TransformationForm
                    action='Add'
                    userId={user.id}
                    type={transformation.type as TransformationTypeKey}
                    creditBalance={user.creditBalance}
                />
            </section>
        </div>
    )
}

export default page
