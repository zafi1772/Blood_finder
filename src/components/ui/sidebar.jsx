import React, { createContext, useContext } from 'react';
import classNames from 'classnames';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  return (
    <SidebarContext.Provider value={{}}>{children}</SidebarContext.Provider>
  );
}

export function Sidebar({ children, className = '', ...props }) {
  return (
    <aside className={classNames('w-64', className)} {...props}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className = '', ...props }) {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className = '', ...props }) {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className = '', ...props }) {
  return (
    <div className={classNames('flex-1 overflow-y-auto', className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children, className = '', ...props }) {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ children, className = '', ...props }) {
  return (
    <div className={classNames('text-gray-500 uppercase text-xs font-semibold', className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, className = '', ...props }) {
  return (
    <div className={classNames('', className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children, className = '', ...props }) {
  return (
    <ul className={classNames('space-y-1', className)} {...props}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({ children, className = '', ...props }) {
  return (
    <li className={classNames('', className)} {...props}>
      {children}
    </li>
  );
}

export function SidebarMenuButton({ children, className = '', asChild = false, ...props }) {
  const Element = asChild ? 'span' : 'button';
  return (
    <Element className={classNames('w-full text-left', className)} {...props}>
      {children}
    </Element>
  );
}

export function SidebarTrigger({ className = '', ...props }) {
  return (
    <button className={classNames('text-gray-700', className)} {...props}>
      ☰
    </button>
  );
}
