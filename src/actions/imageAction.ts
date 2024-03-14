"use server"


import { handleError } from "@/lib/utils";
import { AddImageParams, UpdateImageParams } from "@/types";
import prisma from "@/lib/prismaDb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
    try {
        const author = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        // console.log(author, image)
        if (!author) {
            throw new Error("User not found");
        }

        const newImage = await prisma?.image.create({
            data: {
                title: image.title,
                transformationType: image.transformationType,
                publicId: image.publicId,
                secureURL: image.secureURL,
                width: image.width,
                height: image.height,
                config: image.config,
                transformationURL: image.transformationURL,
                aspectRatio: image.aspectRatio,
                color: image.color,
                prompt: image.prompt,
                author: {
                    connect: {
                        id: author.id
                    }
                }
            }
        });
        console.log(newImage)
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newImage));
    } catch (error) {
        handleError(error)
    }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
    try {
        const imageToUpdate = await prisma.image.findUnique({
            where: {
                id: image._id
            }
        });

        if (!imageToUpdate || imageToUpdate.authorId.toString() !== userId) {
            throw new Error("Unauthorized or image not found");
        }

        const updatedImage = await prisma.image.update(
            {
                where: { id: imageToUpdate.id },
                data: image
            }
        )

        revalidatePath(path);

        return JSON.parse(JSON.stringify(updatedImage));
    } catch (error) {
        handleError(error)
    }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
    try {
        await prisma.image.delete({
            where: {
                id: imageId
            }
        })
    } catch (error) {
        handleError(error)
    } finally {
        redirect('/')
    }
}

// GET IMAGE
export async function getImageById(imageId: string) {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id: imageId
            },
            include: {
                author: true
            }
        })
        if (!image) throw new Error("Image not found");

        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error)
    }
}

