import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GalleryImageMetadata {
    id: string;
    alt?: string;
    blob: ExternalBlob;
    filename: string;
}
export interface GalleryImage {
    id: string;
    alt?: string;
    blob: ExternalBlob;
    filename: string;
}
export interface Inquiry {
    id: bigint;
    service: ServiceType;
    status: InquiryStatus;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone?: string;
    location?: string;
}
export interface UserProfile {
    name: string;
}
export enum InquiryStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress",
    archived = "archived"
}
export enum ServiceType {
    exteriorWashing = "exteriorWashing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createInquiry(name: string, email: string, phone: string | null, service: ServiceType, location: string | null, message: string): Promise<bigint>;
    deleteGalleryImage(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryImage(id: string): Promise<GalleryImage | null>;
    getInquiry(inquiryId: bigint): Promise<Inquiry>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listGalleryImages(): Promise<Array<GalleryImageMetadata>>;
    listInquiries(): Promise<Array<Inquiry>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadGalleryImage(id: string, filename: string, blob: ExternalBlob, alt: string | null): Promise<void>;
}
