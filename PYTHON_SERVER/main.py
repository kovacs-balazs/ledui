from fastapi import FastAPI
import json

app = FastAPI()

def create_rgb(r, g, b):
    return { "r": r, "g": g, "b": b, }

default_gradients = [
    {
            "position": 0,
            "color": "#FF0000"
        },
        {
            "position": 100,
            "color": "#0000FF"
        }
]

default_gradients = [
        {
            "position": 0,
            "color": "#FF0000"
        },
        {
            "position": 56,
            "color": "#EEBB00"
        },
        {
            "position": 100,
            "color": "#0000FF"
        }
]

single_color_gradients = [
    {
            "position": 0,
            "color": "#FF0000"
        },
        {
            "position": 100,
            "color": "#FF0000"
        }
]

solid_animation = {
    "id": 0,
    "colors": default_gradients
}

wave_animation = {
    "id": 1,
    "length": 4,
    "distance": True,
    "speed": 10,
    "colors": single_color_gradients
}

reverse_wave_animation = {
    "id": 2,
    "length": 4,
    "distance": True,
    "speed": 1,
    "colors": default_gradients
}

bounce_wave_animation = {
    "id": 3,
    "length": 4,
    "speed": 1,
    "colors": single_color_gradients
}

audio_bass_animation = {
    "id": 100,
    "decibelThreshold": -20,
    "fadeOut": 500,
    "colors": [
        create_rgb(255, 0, 0),
        create_rgb(255, 255, 0)
    ]
}

audio_high_frequency_animation = {
    "id": 101,
    "decibelThreshold": -20,
    "fadeOut": 500,
    "colors": [
        create_rgb(255, 0, 0),
        create_rgb(255, 255, 0)
    ]
}

default_data = [
        {
            "id": 0, 
            "name": "Bal ajtó",
            "pin": 3,
            "ledCount": 40,
            "power": True,
            "animation": 0,
            "animations": [
                solid_animation,
                wave_animation,
                reverse_wave_animation,
                bounce_wave_animation,
                audio_bass_animation,
                audio_high_frequency_animation
            ]
        },
        {
            "id": 1,
            "name": "Jobb ajtó",
            "pin": 4,
            "ledCount": 50,
            "power": False,
            "animation": 1,
            "animations": [
                solid_animation,
                wave_animation,
                reverse_wave_animation,
                bounce_wave_animation,
                audio_bass_animation,
                audio_high_frequency_animation
            ]
        },
        {
            "id": 2,
            "name": "Hátsó üléssor",
            "pin": 5,
            "ledCount": 60,
            "power": True,
            "animation": 100,
            "animations": [
                solid_animation,
                wave_animation,
                reverse_wave_animation,
                bounce_wave_animation,
                audio_bass_animation,
                audio_high_frequency_animation
            ]
        }
    ]

data = default_data

@app.post("/api/ledstrips/update")
async def update(led_strips: list[dict]):
    global data
    data = led_strips
    print("New data: ", data)
    
    # Use the synchronous 'with' statement for standard file I/O
    with open("data.json", "w", encoding="utf8") as f:
        json.dump(data, f, indent=4) # Added indent for readability
        
    return { "status": "ok", "updated": led_strips }

@app.get("/api/ledstrips")
async def get():
    return data
    return [
        {
            "id": 0, 
            "name": "Bal ajtó",
            "pin": 3,
            "ledCount": 40,
            "power": True,
            "animation": 0,
            "animations": [
                solid_animation,
                wave_animation,
                reverse_wave_animation,
                bounce_wave_animation,
                audio_bass_animation,
                audio_high_frequency_animation
            ]
        },
        {
            "id": 1,
            "name": "Jobb ajtó",
            "pin": 4,
            "ledCount": 50,
            "power": False,
            "animation": 1,
            "animations": [
                solid_animation,
                wave_animation,
                reverse_wave_animation,
                bounce_wave_animation,
                audio_bass_animation,
                audio_high_frequency_animation
            ]
        },
        {
            "id": 2,
            "name": "Hátsó üléssor",
            "pin": 5,
            "ledCount": 60,
            "power": True,
            "animation": 100,
            "animations": [
                solid_animation,
                wave_animation,
                reverse_wave_animation,
                bounce_wave_animation,
                audio_bass_animation,
                audio_high_frequency_animation
            ]
        }
    ]
