import { db } from "@/lib/db";

export async function DELETE(req: Request, context: { params: any }) {
    const deleteId = context.params.id;
    await db.todo.delete({
        where: {
            id: parseInt(deleteId),
        },
    })
    return new Response('Ok')
}

