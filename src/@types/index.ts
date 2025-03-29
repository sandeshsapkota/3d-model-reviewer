export interface Comment {
    comment: string
    id: number
    vertices: Vertex
    isActive: boolean
}

export interface Vertex {
    x: number | null;
    y: number | null
    z: number | null;
}