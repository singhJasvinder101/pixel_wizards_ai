"use server"

import { handleError } from "@/lib/utils";
import prisma from "@/lib/prismaDb";
import { revalidatePath } from "next/cache";
import { CreateUserParams, UpdateUserParams } from "@/types";

// CREATE NEW USER
export const createUser = async (user: CreateUserParams) => {
    console.log("hello")
    try {
        const newUser = await prisma.user.create({
            data: {
                clerkId: user.clerkId,
                email: user.email,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                photo: user.photo,
                password: null,
            }
        });

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error)
    }
}

// FIND USER BY ID
export async function getUserById(userId: string) {
    try {

        const user = await prisma.user.findFirst({
            where: {
                clerkId: userId
            }
        });

        if (!user) throw new Error("User not found");

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        handleError(error);
    }
}

// UPDATING USER
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {

        const updatedUser = await prisma.user.update({
            where: { clerkId },
            data: user
        });

        if (!updatedUser) throw new Error("User update failed");

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error);
    }
}

// DELETE
export async function deleteUser(clerkId: string) {
    try {
        // Find user to delete
        const userToDelete = await prisma.user.findUnique({ where: { clerkId } });

        if (!userToDelete) {
            throw new Error("User not found");
        }

        // Delete user
        const deletedUser = await prisma.user.delete({
            where: { clerkId }
        })
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
    }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
    try {

        const updatedUserCredits = await prisma.user.update({
            where: { id: userId },
            data: { creditBalance: { increment: creditFee } },
        });

        if (!updatedUserCredits) throw new Error("User credits update failed");

        return JSON.parse(JSON.stringify(updatedUserCredits));
    } catch (error) {
        handleError(error);
    }
}