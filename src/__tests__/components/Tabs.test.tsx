import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';

describe('Tabs', () => {
  it('switches content when a trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.queryByText('Content B')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab B' }));

    expect(screen.getByText('Content B')).toBeInTheDocument();
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('renders triggers as type="button" so tabs inside a form do not submit it', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Tab A</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
        </Tabs>
      </form>
    );

    const trigger = screen.getByRole('tab', { name: 'Tab B' });
    expect(trigger).toHaveAttribute('type', 'button');

    await user.click(trigger);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });

  it('allows overriding the trigger type via props', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" type="submit">
            Tab A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('type', 'submit');
  });
});
