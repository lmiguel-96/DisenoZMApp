import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() isLoading = false;
  @Input() size = 2;
  @Input() message: string | undefined;
  @Input() height: string | undefined = 'auto';
  @Input() width: string | undefined = 'auto';

  constructor() {}

  ngOnInit() {}
}
