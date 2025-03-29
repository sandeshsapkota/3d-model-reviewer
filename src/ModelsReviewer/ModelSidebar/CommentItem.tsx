export interface Comment {
    comment: string
    id: number
    vertices: Vertex
}

export interface Vertex {
    x: number
    y: number
    z: number
}

function CoordinateTag({label, value}: { label: string; value: string }) {
    return (
        <div className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
            <span className="font-medium text-gray-600 mr-1">{label}:</span>
            <span className="text-gray-800">{value}</span>
        </div>
    )
}

function CommentItem({comment}: { comment: Comment }) {
    return (
        <li className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <p className="text-gray-800 mb-2">{comment.comment}</p>
            <div className="flex flex-wrap gap-2">
                <CoordinateTag label="X" value={comment.vertices.x.toFixed(3)}/>
                <CoordinateTag label="Y" value={comment.vertices.y.toFixed(3)}/>
                <CoordinateTag label="Z" value={comment.vertices.z.toFixed(3)}/>
            </div>
        </li>
    )
}

export default CommentItem;