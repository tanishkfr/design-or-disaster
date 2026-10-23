"""Export only committed, reviewed project files. Never copy untracked output."""
from pathlib import Path
import subprocess,json,hashlib

root=Path.cwd()
dest=root/'output/final-fixes/public-snapshot'
assert not dest.exists(),'Preserve prior snapshot before creating another'
dest.mkdir(parents=True)
sha=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
entries=subprocess.check_output(['git','ls-tree','-rz','--full-tree','HEAD']).split(b'\0')
allowed_dirs=('src/','public/','scripts/','portfolio-case-study/','docs/')
allowed_files={'.gitignore','package.json','package-lock.json','index.html','vite.config.js','eslint.config.js','vercel.json'}
files=[]
for entry in entries:
 if not entry:continue
 metadata,raw_path=entry.split(b'\t',1)
 path=raw_path.decode()
 if not (path.startswith(allowed_dirs) or path in allowed_files or ('/' not in path and path.endswith('.md'))):continue
 mode,kind,oid=metadata.decode().split()
 assert kind=='blob' and mode=='100644',path
 target=(dest/path).resolve()
 assert target.is_relative_to(dest.resolve())
 content=subprocess.check_output(['git','cat-file','blob',oid])
 target.parent.mkdir(parents=True,exist_ok=True)
 target.write_bytes(content)
 files.append({'path':path,'gitBlob':oid,'sha256':hashlib.sha256(content).hexdigest()})
(root/'output/final-fixes/snapshot-manifest.json').write_text(json.dumps({'sourceSha':sha,'files':files},indent=2))
print(json.dumps({'sourceSha':sha,'files':len(files),'snapshot':str(dest)}))
