import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Noticia } from '../model/noticia';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  url: string = 'http://localhost:8080/favoritos';

  constructor(
    private http: HttpClient
  ) { }

  getFavoritos(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.url);
  }

  addFavorito(noticia: Noticia): Observable<Noticia> {
    console.log(JSON.stringify(noticia) );
    return this.http.post<Noticia>(this.url, noticia);
  }

  deleteFavorito(id: number): Observable<Noticia> {
    console.log(this.url+"/"+id);

    return this.http.delete<Noticia>(this.url + '/'+id);
  }

  getFavorito(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(this.url + `/${id}`);
  }

  getFavoritoByTitle(title: string): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.url + '/title/'+title);
  }
}
