from flask import render_template, request, redirect
from .db import get_page, save_page

def init_app(app):
    @app.route('/')
    def index():
        return redirect('/wiki/Home')

    @app.route('/wiki/<title>')
    def view(title):
        content = get_page(title)
        if content:
            return render_template('view.html', title=title, content=content)
        else:
            return redirect(f'/wiki/{title}/edit')

    @app.route('/wiki/<title>/edit', methods=['GET', 'POST'])
    def edit(title):
        if request.method == 'POST':
            content = request.form['content']
            save_page(title, content)
            return redirect(f'/wiki/{title}')
        content = get_page(title) or ''
        return render_template('edit.html', title=title, content=content)
