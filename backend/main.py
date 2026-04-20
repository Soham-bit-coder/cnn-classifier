from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import io

app = FastAPI(title="CIFAR-10 Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── CIFAR-10 classes ──────────────────────────────────────────────────────────
CLASSES = ["airplane", "automobile", "bird", "cat", "deer",
           "dog", "frog", "horse", "ship", "truck"]

# ── Model definition (must match cnn.py) ─────────────────────────────────────
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.BatchNorm2d(128), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.fc = nn.Sequential(
            nn.Linear(128 * 8 * 8, 256), nn.ReLU(), nn.Dropout(0.5), nn.Linear(256, 10)
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)

# ── Load model ────────────────────────────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = CNN().to(device)

try:
    # Save your trained model with: torch.save(model.state_dict(), 'model.pth')
    model.load_state_dict(torch.load("model.pth", map_location=device))
    model.eval()
    print("✅ Model loaded from model.pth")
except FileNotFoundError:
    print("⚠️  model.pth not found — running with random weights (train & save first)")

# ── Preprocessing (matches cnn.py transforms) ─────────────────────────────────
preprocess = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
])

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "CIFAR-10 Classifier API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probs = F.softmax(outputs, dim=1)[0]

    top5_indices = torch.topk(probs, 5).indices.tolist()
    top5 = [{"class": CLASSES[i], "score": round(probs[i].item(), 4)} for i in top5_indices]

    predicted_idx = top5_indices[0]
    return {
        "predicted_class": CLASSES[predicted_idx],
        "confidence": round(probs[predicted_idx].item(), 4),
        "top5": top5,
    }
