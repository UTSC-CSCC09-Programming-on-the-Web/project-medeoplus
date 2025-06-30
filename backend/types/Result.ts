export default interface Result<T> {
    status: "success" | "error";
    message: string;
    data?: T;
}