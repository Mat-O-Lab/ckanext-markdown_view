[![Tests](https://github.com/Mat-O-Lab/ckanext-markdown_view/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Mat-O-Lab/ckanext-markdown_view/actions/workflows/test.yml)

# ckanext-markdown_view
a CKAN extension creating previews for markdown files


## Requirements

## Purpose

### Notes:

Compatibility with core CKAN versions:

| CKAN version    | Compatible?   |
| --------------- | ------------- |
| 2.8 and earlier  | not tested    |
| 2.9             | yes    |
| 2.10            | yes    |


## Installation

**TODO:** Add any additional installation steps to the list below.
   For example, installing any non-Python dependencies or adding any required
   config settings.

To install markdown_view:

1. Activate your CKAN virtual environment, for example:
```bash
     . /usr/lib/ckan/default/bin/activate
```
2. Clone the source and install it on the virtualenv
```bash
    git clone https://github.com/Mat-O-Lab/ckanext-markdown_view.git
    cd ckanext-markdown_view
    pip install -e .
   pip install -r requirements.txt
```
3. Add `markdown_view` to the `ckan.plugins` and `ckan.views` setting in your CKAN
   config file (by default the config file is located at
   `/etc/ckan/default/ckan.ini`).

4. Restart CKAN. For example, if you've deployed CKAN with Apache on Ubuntu:
```bash
     sudo service apache2 reload
```

## Config settings

```bash
```
or ckan.ini parameters.
```bash
```
If no Api Token is given, only public resources can be uploaded to the triple store!

You can set the default formats to preselected for upload by setting the formats,
```bash
CKANINI__CKANEXT__MARKDOWN__FORMATS = 'text/markdown'
```
else it will react to the listed formats by default

## Highlight View
Each resource can be rendered by highlighting some markdown passage.
The markdown content to highlight must be passed as post to the /highlight url, for example:
```bash
curl -X POST 'https://<ckan_url>/dataset/<dataset_d>/resource/<res_id>/highlight' -F highlight="<markdown code to highlight>"
```


