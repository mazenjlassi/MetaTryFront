import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutDashboard, PenTool, MessageCircle, FileText, Folder, Menu, X, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  icons = {
    layoutDashboard: LayoutDashboard,
    penTool: PenTool,
    messageCircle: MessageCircle,
    fileText: FileText,
    folder: Folder,
    menu: Menu,
    x: X,
    sun: Sun,
    moon: Moon
  };
  mobileMenuOpen = false;
  isDarkMode = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    this.isDarkMode = saved === 'dark';
    this.applyTheme();
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}