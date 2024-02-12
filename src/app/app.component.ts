import { Component, OnInit } from '@angular/core';
import { NoticiaService } from './services/noticia.service';
import { Noticia } from './model/noticia';
import { HttpClient } from '@angular/common/http';
import { NewsResponse } from './model/news-response';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FavoritoService } from './services/favorito.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'noticias';
  noticias?: Noticia[] = [];
 news?: NewsResponse;
  handleError: any;
  titulo = 'Noticias';
  delete:boolean = false;

  filtroForm = new FormGroup({
    registros: new FormControl('10',),
    ordenar: new FormControl('published_at',),
    buscar: new FormControl('',[Validators.pattern('^[a-zA-Z0-9]*$')]),
  });


  constructor(
    private noticiaService: NoticiaService,
    private favoritosService: FavoritoService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
   this.listarNoticias(10, 4, 'publishedAt');
    console.log("prueba");
  }

  inicio() {
    this.titulo = 'Noticias';
    this.delete = false;
    this.listarNoticias(10, 1, 'publishedAt');
  }

  listarFavoritos(){
    this.favoritosService.getFavoritos()
      .subscribe({
        next: (data: Noticia[]) => {
          this.noticias = data;
          this.titulo = 'Favoritos';
          this.delete = true;
          console.log(data);
        },
        error: (error) => {
          this.handleError = error;
          console.log(error);
        }
      });
  }

  listarNoticias(limit: number, start: number, sort: string) {
    this.noticiaService.getNoticias(limit, start, sort)
      .subscribe({
        next: (data: NewsResponse) => {
          this.news = data;
          this.noticias = this.news.results;
        //  console.log(data);
        },
        error: (error) => {
          this.handleError = error;
          console.log(error);
        }
      });
  }

  filtrar() {
    if (this.titulo === 'Noticias') {
      this.filtrarNoticias();
    } else {
      this.filtrarFavoritos();
    }
  }

  filtrarNoticias() {
    const limit = this.filtroForm.get('registros')?.value || '10';
    const sort = this.filtroForm.get('ordenar')?.value || 'published_at';
    const start = 1;
    const search = this.filtroForm.get('buscar')?.value || '';
    console.log(JSON.stringify(this.filtroForm.value));
    console.log(limit, sort, start, search);

    this.noticiaService.getnoticiasBytitle(limit, start, sort, search)
      .subscribe({
        next: (data: NewsResponse) => {
          this.news = data;
          this.noticias = this.news.results;
          console.log(data);
        },
        error: (error) => {
          this.handleError = error;
          console.log(error);
        }
      });
  }

  filtrarFavoritos() {
    const limit = this.filtroForm.get('registros')?.value || '10';
    const sort = this.filtroForm.get('ordenar')?.value || 'published_at';
    const start = 1;
    const search = this.filtroForm.get('buscar')?.value || '';
    console.log(JSON.stringify(this.filtroForm.value));
    console.log(limit, sort, start, search);

    this.favoritosService.getFavoritoByTitle(search)
      .subscribe({
        next: (data: Noticia[]) => {
          this.noticias = data;
          console.log(data);
        },
        error: (error) => {
          this.handleError = error;
          console.log(error);
        }
      });
  }

  addFavoritos(noticia: Noticia) {
    console.log(noticia);
    this.agregarFavoritos(noticia);
  }

  agregarFavoritos(noticia: Noticia) {
    const fechaDeHoy: Date = new Date();
    const fechaFormateada: string = format(fechaDeHoy, 'yyyy-MM-dd');
    noticia.agregadoAt = fechaFormateada; // fecha en que se agrego a favoritos
    this.favoritosService.addFavorito(noticia);
    console.log("Agregado a favoritos");
  }

  deleteFavorito(noticia: Noticia) {
    if (noticia.id) {
      console.log(noticia.id);
      this.favoritosService.deleteFavorito(noticia.id);
      this.listarFavoritos();
    }
  }

}


