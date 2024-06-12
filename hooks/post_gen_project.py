#!/usr/bin/env python
import pathlib


if __name__ == '__main__':
    if 'Not open source' == '{{ cookiecutter.open_source_license }}':
        pathlib.Path('LICENSE').unlink()
