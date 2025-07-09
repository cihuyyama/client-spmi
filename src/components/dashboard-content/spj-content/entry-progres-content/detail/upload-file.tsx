import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios from 'axios'
import { BASE_URL } from '@/constant/BaseURL'
import Image from 'next/image'

// Zod schema for file upload
const fileSchema = z.object({
    files: z.array(z.any()).min(1, { message: "At least one file is required" }),
})

// File type for our application
type FileWithPreview = {
    file: File;
    preview: string;
    id: string;
}

export enum TahapDokumen {
    Persiapan = "persiapan",
    Pelaksanaan = "pelaksanaan",
    Laporan = "Laporan",
}

export default function FileUploadWithPreview({ id, tahap }: { id: string, tahap: TahapDokumen }) {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null)

    // Initialize the form
    const form = useForm<z.infer<typeof fileSchema>>({
        resolver: zodResolver(fileSchema),
        defaultValues: {
            files: [],
        },
    })

    // Handle file drops with preview generation
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => {
            // Create preview URLs for image files
            const isImage = file.type.startsWith('image/')
            const isPdf = file.type === 'application/pdf'

            let preview = '/api/placeholder/200/200'
            if (isImage) {
                preview = URL.createObjectURL(file)
            } else if (isPdf) {
                preview = '/api/placeholder/200/200' // Placeholder for PDF
            }

            return {
                file,
                preview,
                id: crypto.randomUUID()
            }
        })

        setFiles(prevFiles => [...prevFiles, ...newFiles])

        // Update form value
        const updatedFiles = [...files, ...newFiles].map(f => f.file)
        form.setValue('files', updatedFiles)
    }, [files, form])

    // Set up dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'application/pdf': [],
            'application/msword': [],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
            'text/plain': []
        }
    })

    // Handle removing a file
    const removeFile = (id: string) => {
        const updatedFiles = files.filter(f => f.id !== id)
        setFiles(updatedFiles)
        form.setValue('files', updatedFiles.map(f => f.file))

        // Close preview if the removed file is being previewed
        if (previewFile && previewFile.id === id) {
            setPreviewFile(null)
        }
    }

    // Handle preview
    const openPreview = (file: FileWithPreview) => {
        setPreviewFile(file)
    }

    // Clean up object URLs on unmount
    React.useEffect(() => {
        return () => {
            files.forEach(file => {
                if (file.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(file.preview)
                }
            })
        }
    }, [files])

    function onSubmit(values: z.infer<typeof fileSchema>) {
        const formData = new FormData()

        // Check if any file exceeds the limit before proceeding
        const oversizedFiles = values.files.filter(file => file.size > 2 * 1024 * 1024)

        if (oversizedFiles.length > 0) {
            oversizedFiles.forEach(file => {
                toast.error(`File ${file.name} melebihi 2MB limit`)
            })
            return // This prevents the form submission entirely
        }

        formData.append("id", id)

        values.files.forEach((file) => {
            formData.append(`files`, file)
        })

        toast.promise(
            axios.post(`${BASE_URL}/entry-progres/dokumen/${tahap}`, formData, {
                withCredentials: true
            }),
            {
                loading: "Menyimpan data...",
                success: (data) => {
                    setTimeout(() => {
                        // bidang.push('/bidang')
                    }, 300);
                    return `Berhasil menyimpan data`
                },
                error: (e) => {
                    console.log(e)
                    if (e.status === 413) {
                        return `File terlalu besar (Maximum 2MB)`
                    }
                    return `Gagal menyimpan data: ${e?.message}`
                }
            }
        )
    }

    // Get file icon based on type
    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return '🖼️'
        if (type === 'application/pdf') return '📄'
        if (type.includes('word')) return '📝'
        if (type === 'text/plain') return '📃'
        return '📁'
    }

    // Format file size
    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} B`
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
        return `${(size / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        // <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="files"
                    render={() => (
                        <FormItem>
                            {/* <FormLabel>Upload Files</FormLabel> */}
                            <FormControl>
                                <div
                                    {...getRootProps()}
                                    className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-200 cursor-pointer ${isDragActive
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-400'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <p className="text-gray-600">
                                        Drop files here, or click to select files
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Max file size 2 MB
                                    </p>
                                </div>
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                                Upload files to be processed. Click on a file to preview it.
                            </FormDescription>
                        </FormItem>
                    )}
                />

                {/* File Preview List */}
                {files.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                        <ul className="space-y-2">
                            {files.map((fileItem) => (
                                <li
                                    key={fileItem.id}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <div
                                        className="flex items-center flex-1 cursor-pointer"
                                        onClick={() => openPreview(fileItem)}
                                    >
                                        <span className="mr-2 text-lg">{getFileIcon(fileItem.file.type)}</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium truncate max-w-xs">
                                                {fileItem.file.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatFileSize(fileItem.file.size)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(fileItem.id);
                                        }}
                                        className="text-red-500 hover:bg-red-50 ml-2"
                                    >
                                        <X size={16} />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Preview Dialog */}
                <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center">
                                <span className="mr-2">{previewFile && getFileIcon(previewFile.file.type)}</span>
                                <span className="truncate">{previewFile?.file.name}</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 flex justify-center">
                            {previewFile && previewFile.file.type.startsWith('image/') ? (
                                <Image
                                    src={previewFile.preview}
                                    alt={previewFile.file.name}
                                    className="max-h-96 max-w-full object-contain"
                                />
                            ) : (
                                <div className="p-8 text-center bg-gray-100 rounded-lg w-full">
                                    <div className="text-5xl mb-4">{previewFile && getFileIcon(previewFile.file.type)}</div>
                                    <p>{previewFile?.file.name}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {previewFile?.file.type} • {previewFile && formatFileSize(previewFile.file.size)}
                                    </p>
                                    <p className="mt-4 text-gray-600">
                                        Preview not available for this file type
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Close</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={files.length === 0}
                >
                    Upload {files.length > 0 ? `(${files.length} files)` : ''}
                </Button>
            </form>
        </Form>
        // </div>
    )
}