"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function AvatarUpload({ uid, url, size = 120, onUpload }: { uid: string, url: string | null, size?: number, onUpload: (url: string) => void }) {
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) downloadImage(url);
    }, [url]);

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from("avatars").download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log("Error downloading image: ", error);
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${uid}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
            setAvatarUrl(URL.createObjectURL(file)); // Optimistic update
        } catch (error) {
            alert("Profil fotoğrafı yüklenirken hata oluştu! Lütfen 'avatars' isimli storage bucket'ın oluşturulduğundan emin olun.");
            console.log(error);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            <label
                htmlFor="single"
                style={{
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    height: "100%"
                }}
            >
                <div style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "hsl(var(--muted))",
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt="Avatar"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <div style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${size / 2.5}px`,
                            color: "hsl(var(--muted-foreground))"
                        }}>
                            👤
                        </div>
                    )}

                    {/* Overlay for Edit/Upload */}
                    <div className="avatar-overlay" style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: uploading ? 1 : 0,
                        transition: "opacity 0.2s",
                        color: "white",
                        fontSize: "1.5rem"
                    }}>
                        {uploading ? "⏳" : "📷"}
                    </div>
                </div>

                <input
                    style={{
                        visibility: "hidden",
                        position: "absolute",
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </label>
            <style jsx>{`
                label:hover .avatar-overlay {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}
