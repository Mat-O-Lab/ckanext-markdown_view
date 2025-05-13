# -*- coding: utf-8 -*-
from setuptools import setup, find_packages  # Always prefer setuptools over distutils
from codecs import open  # To use a consistent encoding
from os import path, environ

here = path.abspath(path.dirname(__file__))

# Get the long description from the relevant file
with open(path.join(here, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

#with open(path.join(here,"requirements.txt")) as f:
#    requirements = f.read().splitlines()

setup(
    name="""ckanext-markdown_view""",
    # Versions should comply with PEP440.  For a discussion on single-sourcing
    # the version across setup.py and the project code, see
    # http://packaging.python.org/en/latest/tutorial.html#version
    version=environ.get('VERSION', '0.0.0'),
    description="""An extension for a markdown preview""",
    long_description=long_description,
    long_description_content_type="text/markdown",
    # install_requires=requirements,
    # The project's main homepage.
    url="https://github.com/Mat-O-Lab/ckanext-markdown_view",
    # Author details
    author="""Thomas Hanke""",
    author_email="""thomas.hanke@iwm.fraunhofer.de""",
    # Choose your license
    license="AGPL",
    # See https://pypi.python.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        # How mature is this project? Common values are
        # 3 - Alpha
        # 4 - Beta
        # 5 - Production/Stable
        "Development Status :: 4 - Beta",
        # Pick your license as you wish (should match "license" above)
        "License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)",
        # Specify the Python versions you support here. In particular, ensure
        # that you indicate whether you support Python 2, Python 3 or both.
        "Programming Language :: Python :: 3.8",
    ],
    # What does your project relate to?
    keywords="""CKAN Markdown""",
    entry_points="""
        [ckan.plugins]
        markdown_view=ckanext.markdown_view.plugin:MarkdownViewPlugin
        [babel.extractors]
        ckan = ckan.lib.extract:extract_ckan
    """,
    message_extractors={
        "ckanext": [
            ("**.py", "python", None),
            ("**.js", "javascript", None),
            ("**/templates/**.html", "ckan", None),
        ],
    },
)
