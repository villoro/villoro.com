1. Create new `main` branch

2. `Cherry pick` the oldest commit on `master`

3. Edit the new `commit` date with

```sh
set GIT_COMMITTER_DATE=2018-10-07T11:37:00
git commit --amend --no-edit --date="2018-10-07 11:37:00"
```

4. Remove the `tag` from the `cherry picked` commit in `github` and locally

5. Apply the `tag` to the newly created commit

6. Push new `tag` to `github`

```bash
pip install gitpython
```


```python
import git
import pandas as pd

repo = git.Repo('/repo/path') # edit it

data = []

for tag in repo.tags:
    commit = tag.commit

    data.append([
        tag.name,
        commit.hexsha,
        commit.authored_datetime,
        commit.message,
    ])

df = pd.DataFrame(data, columns=["tag", "commit", "dt", "message"])
df = df.sort_values("dt").reset_index(drop=True)
df.to_csv("commits.csv") # Export it just in case something goes wron
```

```python
COMMANDS = """
git cherry-pick {commit} -m 1
export GIT_COMMITTER_DATE="{datetime:%Y-%m-%dT%H:%M:%S}"
git commit --amend --no-edit --date="{datetime:%Y-%m-%d %H:%M:%S}"
git tag -a {tag} -m "" -f
git push origin {tag} -f
"""

out = ""
for _, row in df.iterrows():
    out += COMMANDS.format(**row)

with open("commands.sh", "w") as stream:
    stream.write(out)
```

```
sh commands.sh
```
