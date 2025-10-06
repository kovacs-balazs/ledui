import { NextResponse } from "next/server";

export async function GET() {
    let response;

    try {
        response = await fetch("http://192.168.1.202:8000/api/ledstrips")
    } catch (error) {
        return NextResponse.json(
            { error: "Network Error", messages: (error as Error).message },
            { status: 500 }
        )
    }

    if (!response.ok) {
        const errorObject = JSON.parse(await response.text());
        return NextResponse.json(
            { error: 'Request Error', message: `${response.status} ${errorObject.error} ${errorObject.message ?? ""}`.trim() },
            { status: response.status }
        );
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        return NextResponse.json(
            { error: 'JSON Parsing Error', message: (error as Error).message },
            { status: 500 }
        );
    }

    // The actual data is usually nested under a `data` key
    return NextResponse.json(data || []);
}


export async function POST(request: Request) {
    let body;

    // Body beolvasása
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "JSON Parsing Error", message: (error as Error).message },
            { status: 400 }
        );
    }

    let response;
    try {
        response = await fetch("http://192.168.1.202:8000/api/ledstrips/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Network Error", message: (error as Error).message },
            { status: 500 }
        );
    }

    if (!response.ok) {
        let errorObject: any = {};
        try {
            errorObject = JSON.parse(await response.text());
        } catch {
            errorObject = { error: "Unknown", message: "No details" };
        }
        return NextResponse.json(
            {
                error: "Request Error",
                message: `${response.status} ${errorObject.error ?? ""} ${errorObject.message ?? ""}`.trim()
            },
            { status: response.status }
        );
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        return NextResponse.json(
            { error: "JSON Parsing Error (from backend)", message: (error as Error).message },
            { status: 500 }
        );
    }

    return NextResponse.json(data || {});
}
