with open(download_path, 'rb') as file:
    content = file.read().decode('utf-8', 'ignore')
    reader = csv.reader(content.splitlines())
    # ...
