/* eslint-disable no-unused-vars */

import { Image } from "@prisma/client";

// ====== USER PARAMS
export type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    photo: string;
};

export type UpdateUserParams = {
    firstname: string;
    lastname: string;
    username: string;
    photo: string;
};

// ====== IMAGE PARAMS
export type AddImageParams = {
    image: {
        title: string;
        publicId: string;
        transformationType: string;
        width: number;
        height: number;
        config: any;
        secureURL: string;
        transformationURL: string;
        aspectRatio: string | undefined;
        prompt: string | undefined;
        color: string | undefined;
    };
    userId: string;
    path: string;
};

export type UpdateImageParams = {
    image: {
        _id: string;
        title: string;
        publicId: string;
        transformationType: string;
        width: number;
        height: number;
        config: any;
        secureURL: string;
        transformationURL: string;
        aspectRatio: string | undefined;
        prompt: string | undefined;
        color: string | undefined;
    };
    userId: string;
    path: string;
};

export type Transformations = {
    restore?: boolean;
    fillBackground?: boolean;
    remove?: {
        prompt: string;
        removeShadow?: boolean;
        multiple?: boolean;
    };
    recolor?: {
        prompt?: string;
        to: string;
        multiple?: boolean;
    };
    removeBackground?: boolean;
};

// ====== TRANSACTION PARAMS
export type CheckoutTransactionParams = {
    plan: string;
    credits: number;
    amount: number;
    buyerId: string;
};

export type CreateTransactionParams = {
    stripeId: string;
    amount: number;
    credits: number;
    plan: string;
    buyerId: string;
    createdAt: Date;
};

export type TransformationTypeKey =
    | "restore"
    | "fill"
    | "remove"
    | "recolor"
    | "removeBackground";

// ====== URL QUERY PARAMS
export type FormUrlQueryParams = {
    searchParams: string;
    key: string;
    value: string | number | null;
};

export type UrlQueryParams = {
    params: string;
    key: string;
    value: string | null;
};

export type RemoveUrlQueryParams = {
    searchParams: string;
    keysToRemove: string[];
};

export type SearchParamProps = {
    params: { id: string; type: TransformationTypeKey };
    searchParams: { [key: string]: string | string[] | undefined };
};

export type TransformationFormProps = {
    action: "Add" | "Update";
    userId: string;
    type: TransformationTypeKey;
    creditBalance: number;
    data?: Image | null;
    config?: Transformations | null;
};

export type TransformedImageProps = {
    image: any;
    type: string;
    title: string;
    transformationConfig: Transformations | null;
    isTransforming: boolean;
    hasDownload?: boolean;
    setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
};