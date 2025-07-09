"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import FileUploadWithPreview, { TahapDokumen } from "./upload-file"

export function DialogUploader({ id, tahap }: { id: string, tahap: TahapDokumen }) {
    const [files, setFiles] = React.useState<File[]>([])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Tambah Dokumen {files.length > 0 && `(${files.length})`}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Tambah Dokumen</DialogTitle>
                    {/* <DialogDescription>
                        Drag and drop your files here or click to browse.
                    </DialogDescription> */}
                </DialogHeader>
                <FileUploadWithPreview id={id} tahap={tahap} />
            </DialogContent>
        </Dialog>
    )
}