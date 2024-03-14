"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants/index"
import { AddImageParams, TransformationFormProps, Transformations } from '@/types'
import CustomformField from './CustomformField'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import MediaUploader from './Upload'
import TransformedImage from './TransformedImage'
import { updateCredits } from '@/actions/userActions'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/actions/imageAction'
import { useRouter } from 'next/navigation'
import InsufficientCreditsModal from './InsufficientCreditsModal'

export const formSchema = z.object({
    // username: z.string().min(2).max(50),
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string(),
})

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {
    const transformationType = transformationTypes[type]
    const [image, setImage] = useState(data)
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isTransforming, setIsTransforming] = useState(false)
    const [transformationConfig, setTransformationConfig] = useState(config)

    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const initialValues = data && action === 'Update' ? {
        title: data?.title ?? undefined,
        aspectRatio: data?.aspectRatio ?? undefined,
        color: data?.color ?? undefined,
        prompt: data?.prompt ?? undefined,
        publicId: data?.publicId,
    } : defaultValues;


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        console.log(values)

        if (data || image) {
            const src = image?.publicId ?? undefined;
            const width = image?.width ?? undefined;
            const height = image?.height ?? undefined;

            if (src && width && height) {
                // console.log("hello")
                const transformationURL = getCldImageUrl({
                    width,
                    height,
                    src,
                    ...transformationConfig,
                });

                const imageData = {
                    title: values.title,
                    publicId: image?.publicId as string,
                    transformationType: type,
                    width: image?.width as number,
                    height: image?.height as number,
                    config: transformationConfig,
                    secureURL: image?.secureURL as string,
                    transformationURL: transformationURL,
                    aspectRatio: values.aspectRatio,
                    prompt: values.prompt,
                    color: values.color,
                };

                if (action === 'Add') {
                    try {
                        const newImage = await addImage({
                            image: imageData,
                            userId,
                            path: '/',
                        });


                        if (newImage) {
                            form.reset();
                            setImage(data);
                            router.push(`/transformations/${newImage.id}`);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
                if (action === 'Update') {
                    try {
                        const updatedImage = await updateImage({
                            image: {
                                ...imageData,
                                _id: data?.id as string
                            },
                            userId,
                            path: `/transformations/${data?.id}`
                        })

                        if (updatedImage) {
                            router.push(`/transformations/${updatedImage._id}`)
                        }
                    } catch (error) {
                        console.log(error);
                    }

                }
            } else {
                console.error('src, width, or height is undefined');
            }
        }
        console.log(values);
    }


    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]

        setImage((prev: any) => ({
            ...prev,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height,
        }))
        setNewTransformation(transformationType.config)

        return onChangeField(value)
    }

    const onInputChangeHandler =
        (fieldname: string,
            value: string,
            type: string,
            onChangeField: (value: string)
                => void) => {
            console.log(fieldname, value, type, onChangeField)

            debounce(() => {
                setNewTransformation((prev: any) => ({
                    ...prev,
                    [type]: {
                        ...prev?.[type],
                        [fieldname === "prompt" ? "prompt" : "to"]: value,
                    },
                }))
            }, 1000)()

            return onChangeField(value)
        }

    const onTransformHandler = async () => {
        setIsTransforming(true)

        setTransformationConfig(deepMergeObjects(transformationConfig, newTransformation))

        setNewTransformation(null)

        startTransition(async () => {
            await updateCredits(userId, creditFee)
        })
    }


    useEffect(() => {
        if (image && (type === 'restore' || type === 'removeBackground')) {
            console.log(transformationType.config)
            setNewTransformation(transformationType.config)
        }
    }, [image, transformationType.config, type])
    // transformationType?.config, also to overwride the config for these pages

    return (
        <div>
            <Form {...form}>
                {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CustomformField
                        control={form.control}
                        name='title'
                        formLabel='Image Title'
                        className='w-full'
                        customRender={(({ field }) => <Input {...field} className='input-field' />)}
                    />

                    {type === "fill" && (
                        <CustomformField
                            control={form.control}
                            name='aspectRatio'
                            formLabel='Aspect Ratio'
                            className='w-full'
                            customRender={(({ field }) => (
                                <Select
                                    onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-[180px] select-field">
                                        <SelectValue placeholder="Aspect Ratio" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        {Object.keys(aspectRatioOptions).map((a, key) => (
                                            <SelectItem key={key} value={a} className="select-item">
                                                {aspectRatioOptions[a as AspectRatioKey].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ))}
                        />
                    )}


                    {(type === 'remove' || type === 'recolor') && (
                        <div className="prompt-field">
                            <CustomformField
                                control={form.control}
                                name="prompt"
                                formLabel={
                                    type === 'remove' ? 'Object to remove' : 'Object to recolor'
                                }
                                className="w-full"
                                customRender={({ field }) => (
                                    <Input
                                        value={field.value}
                                        className="input-field"
                                        onChange={(e) => onInputChangeHandler(
                                            'prompt',
                                            e.target.value,
                                            type,
                                            field.onChange
                                        )}
                                    />
                                )}
                            />


                            {type === 'recolor' && (
                                <>
                                    <CustomformField
                                        control={form.control}
                                        name="color"
                                        formLabel="Replacement Color"
                                        className="w-full"
                                        customRender={({ field }) => (
                                            <Input
                                                value={field.value}
                                                className="input-field"
                                                onChange={(e) => onInputChangeHandler(
                                                    'color',
                                                    e.target.value,
                                                    'recolor',
                                                    field.onChange
                                                )}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    <div className="media-uploader-field md:flex justify-between flex-wrap">
                        <CustomformField
                            control={form.control}
                            name="publicId"
                            className="flex md:w-[45%] flex-col"
                            customRender={({ field }) => (
                                <MediaUploader
                                    onValueChange={field.onChange}
                                    setImage={setImage}
                                    publicId={field.value}
                                    image={image}
                                    type={type}
                                />
                            )}
                        />

                        <div className='md:w-[45%]'>
                            <TransformedImage
                                image={image}
                                type={type}
                                title={form.getValues().title}
                                isTransforming={isTransforming}
                                setIsTransforming={setIsTransforming}
                                transformationConfig={transformationConfig}
                            />
                        </div>
                    </div>


                    <div className="flex flex-col gap-4">
                        <Button
                            type="button"
                            className="submit-button capitalize"
                            disabled={isTransforming || newTransformation === null}
                            onClick={onTransformHandler}
                        >
                            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
                        </Button>
                        <Button
                            type="submit"
                            className="submit-button capitalize"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Save Image'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default TransformationForm
