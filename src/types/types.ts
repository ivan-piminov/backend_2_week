export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    id: string,
    createdAt: string
}
export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    id: string,
    blogName: string,
    createdAt: string
}
