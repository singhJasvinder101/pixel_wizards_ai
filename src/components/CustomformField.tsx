import React from 'react'

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

import { formSchema } from "./TransformationForm";
import { Control } from 'react-hook-form';
import { z } from 'zod';

type CustomFieldProps = {
    control: Control<z.infer<typeof formSchema>> | undefined;
    customRender: (props: { field: any }) => React.ReactNode;
    name: keyof z.infer<typeof formSchema>;
    formLabel?: string;
    className?: string;
};


export const CustomformField = ({
    control,
    customRender,
    name,
    formLabel,
    className,
}: CustomFieldProps) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {formLabel && <FormLabel>{formLabel}</FormLabel>}
                    <FormControl>
                        {/* <Input placeholder="shadcn" {...field} /> */}
                        {customRender({ field })} 
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default CustomformField
