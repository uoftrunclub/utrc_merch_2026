import base64, os
assets = ["img/logo.svg","img/tee-black.png","img/tee-black-back.png","img/tee-navy.png","img/tee-navy-back.png",
          "img/tee-white.png","img/tee-white-back.png","img/shorts-black.png","img/shorts-white.png"]
def datauri(p):
    ext=p.lower().rsplit(".",1)[1]
    if ext=="svg":
        mime="image/svg+xml"; raw=open(p,"rb").read()
    else:
        mime="image/png"; raw=open(p,"rb").read()
        try:
            from PIL import Image; import io
            im=Image.open(p).convert("RGBA")
            w,h=im.size; maxw=760
            if w>maxw:
                im=im.resize((maxw,int(h*maxw/w)))
            buf=io.BytesIO(); im.save(buf,"PNG",optimize=True); raw=buf.getvalue()
        except Exception:
            pass
    return f"data:{mime};base64,"+base64.b64encode(raw).decode()
html=open("index.html",encoding="utf-8").read()
for a in assets:
    html=html.replace(a, datauri(a))
open("preview-artifact.html","w",encoding="utf-8").write(html)
print("wrote preview-artifact.html", round(os.path.getsize("preview-artifact.html")/1024), "KB")
