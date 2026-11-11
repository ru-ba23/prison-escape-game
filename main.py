
import asyncio, math, random
from js import document, window
from pyodide.ffi import create_proxy

# Prison Escape — Python browser game (runs with Pyodide)
canvas = document.getElementById("game")
ctx = canvas.getContext("2d")
W, H = 900, 540
keys = set()
player = {"x": 90, "y": 430, "w": 34, "h": 48, "speed": 3.4}
guard = {"x": 490, "y": 250, "dir": 1, "left": 420, "right": 690}
items = [
    {"x": 245, "y": 430, "name": "مفتاح", "got": False},
    {"x": 710, "y": 160, "name": "بطاقة", "got": False},
]
mission = 0
message = "المهمة 1: ابحثي عن المفتاح الأصفر."
message_timer = 0
caught_timer = 0
won = False
game_over = False
tick = 0

def key_down(e):
    keys.add(e.key.lower())
def key_up(e):
    keys.discard(e.key.lower())

kd = create_proxy(key_down); ku = create_proxy(key_up)
document.addEventListener("keydown", kd)
document.addEventListener("keyup", ku)

def rect(x,y,w,h,color):
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)

def text(s,x,y,size=18,color="#f7f2e8",align="left"):
    ctx.fillStyle = color
    ctx.font = f"bold {size}px system-ui, sans-serif"
    ctx.textAlign = align
    ctx.fillText(s,x,y)

def draw_person(x,y,guard=False):
    # simple readable character sprite drawn in Python
    if guard:
        # guard uniform
        rect(x+8,y+12,20,28,"#365b75")
        rect(x+9,y+2,18,15,"#d9a47b")
        rect(x+7,y,22,7,"#263c50")
        rect(x+8,y+40,8,10,"#202b38"); rect(x+20,y+40,8,10,"#202b38")
        rect(x+3,y+18,7,18,"#d9a47b"); rect(x+27,y+18,7,18,"#d9a47b")
        rect(x+11,y+7,3,3,"#202020"); rect(x+21,y+7,3,3,"#202020")
    else:
        # prisoner in orange uniform, dark ponytail
        rect(x+7,y+11,21,28,"#f28b32")
        rect(x+9,y+2,17,15,"#d9a47b")
        rect(x+6,y+0,22,8,"#30251f")
        rect(x+23,y+5,8,15,"#30251f")
        rect(x+4,y+17,7,18,"#d9a47b"); rect(x+27,y+17,7,18,"#d9a47b")
        rect(x+9,y+39,8,10,"#e8e3dc"); rect(x+21,y+39,8,10,"#e8e3dc")
        rect(x+12,y+7,3,3,"#242424"); rect(x+21,y+7,3,3,"#242424")
        text("0726",x+17,y+29,7,"#733b16","center")

def reset():
    global mission, message, caught_timer, won, game_over
    player.update(x=90,y=430)
    for i in items: i["got"] = False
    guard.update(x=490,y=250,dir=1)
    mission=0; message="المهمة 1: ابحثي عن المفتاح الأصفر."
    caught_timer=0; won=False; game_over=False

def update():
    global tick, mission, message, message_timer, caught_timer, won, game_over
    tick += 1
    if game_over or won:
        return
    dx=dy=0
    if "arrowleft" in keys or "a" in keys: dx-=player["speed"]
    if "arrowright" in keys or "d" in keys: dx+=player["speed"]
    if "arrowup" in keys or "w" in keys: dy-=player["speed"]
    if "arrowdown" in keys or "s" in keys: dy+=player["speed"]
    player["x"]=max(20,min(W-55,player["x"]+dx))
    player["y"]=max(105,min(H-65,player["y"]+dy))
    guard["x"] += guard["dir"]*2.0
    if guard["x"] > guard["right"] or guard["x"] < guard["left"]:
        guard["dir"] *= -1
    # collect mission objects
    for idx,it in enumerate(items):
        if not it["got"] and abs(player["x"]-it["x"])<35 and abs(player["y"]-it["y"])<38:
            it["got"]=True
            if idx==0:
                mission=1; message="رائع! حصلتِ على المفتاح. ابحثي عن بطاقة المرور."
            else:
                mission=2; message="أحسنتِ! وصلتِ إلى بوابة الخروج."
            message_timer=180
    # guard contact pauses player briefly; arcade-style, no harmful detail
    if abs(player["x"]-guard["x"])<28 and abs(player["y"]-guard["y"])<35:
        caught_timer=90
        player["x"],player["y"]=90,430
        message="الحارس لاحظك! حاولي مرة ثانية وراقبي مساره."
        message_timer=180
    if mission==2 and player["x"]>820 and player["y"]<220:
        won=True
        message="نجحتِ! خرجتِ من السجن 🎉"

def draw():
    ctx.clearRect(0,0,W,H)
    # background / walls
    rect(0,0,W,H,"#18232e")
    rect(18,95,W-36,H-115,"#344451")
    # tiled floor
    for x in range(25,875,45):
        rect(x,105,1,420,"#405361")
    for y in range(110,530,42):
        rect(20,y,860,1,"#405361")
    # cell bars
    rect(20,95,860,8,"#a9b5bb")
    for x in range(35,875,34):
        rect(x,95,4,52,"#9aa7ad")
    # doors / exit
    rect(810,112,58,95,"#1d2932")
    rect(818,120,42,79,"#4e936d" if mission==2 else "#8a6042")
    text("EXIT",839,174,14,"#ffffff","center")
    # furniture
    rect(45,300,115,18,"#7c624b"); rect(52,318,8,48,"#6b513e"); rect(145,318,8,48,"#6b513e")
    rect(60,270,85,25,"#9aabb1")
    # objects
    for it in items:
        if not it["got"]:
            color="#f5d34d" if it["name"]=="مفتاح" else "#65d6d0"
            rect(it["x"]-9,it["y"]-9,18,18,color)
            text(it["name"],it["x"],it["y"]-15,13,"#ffffff","center")
    draw_person(guard["x"],guard["y"],True)
    draw_person(player["x"],player["y"],False)
    # HUD
    rect(0,0,W,75,"#111a22")
    text("PRISON ESCAPE",24,30,19,"#ffb36b")
    text(message,24,58,16,"#f7f2e8")
    text(f"المهمات: {mission}/2",W-24,30,16,"#9fe3d0","right")
    text("الحركة: الأسهم أو WASD",W-24,57,13,"#c4d0d7","right")
    if won:
        rect(220,190,460,150,"#101820")
        text("فزتِ! 🎉",450,245,34,"#9fe3d0","center")
        text("اضغطي إعادة اللعب للبدء من جديد",450,290,18,"#ffffff","center")
    if game_over:
        text("انتهت اللعبة",450,270,30,"#ffffff","center")

async def loop():
    while True:
        update()
        draw()
        await asyncio.sleep(1/60)

asyncio.create_task(loop())

def restart_click(event):
    reset()
restart_proxy=create_proxy(restart_click)
document.getElementById("restart").addEventListener("click",restart_proxy)
