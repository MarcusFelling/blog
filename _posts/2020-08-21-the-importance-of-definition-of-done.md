---
id: 923
title: 'The importance of the Definition of Done'
date: '2020-08-21T17:02:01+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=923'
permalink: /blog/2020/the-importance-of-definition-of-done/
thumbnail-img: /content/uploads/2020/08/definitionOfDoneAzureBoards.png
nav-short: true
tags: [Azure DevOps]
---

I’ve worked with quite a few teams who aren’t aware of, or forget about, the Definition of “Done”. In my opinion, this is one of the easiest, low effort, high impact elements of Agile that a team can adopt.

## What is the definition of “done”?

The Scrum Guide defines the definition of done as the following,

> When a Product Backlog item or an Increment is described as “Done”, everyone must understand what “Done” means. Although this may vary significantly per Scrum Team, members must have a shared understanding of what it means for work to be complete, to ensure transparency. This is the definition of “Done” for the Scrum Team and is used to assess when work is complete on the product Increment.
> 
> <cite>[https://www.agilealliance.org/glossary/definition-of-done](https://www.agilealliance.org/glossary/definition-of-done/#q=~(infinite~false~filters~(postType~(~'page~'post~'aa_book~'aa_event_session~'aa_experience_report~'aa_glossary~'aa_research_paper~'aa_video))~searchTerm~'~sort~false~sortDirection~'asc~page~1))<https://scrumguides.org/scrum-guide.html#artifact-transparency-done></cite>

The definition of done will help **ensure** you have a releasable product that has valuable functionalities.

Having the team create this definition TOGETHER, is a small tweak that can be really significant. This definition should be the same for each and every story and align with what it means to be done for the project or product as a whole.

[The Study of Product Team Performance](https://actuationconsulting.com/study-product-team-performance/) asked, “*Who, if anyone, defines done for their teams*?” The data revealed two things:

1. Teams that don’t define “done” don’t perform well
2. Organizations in which team members themselves create a clear definition of done are more likely to out perform their counterparts

## Sharing your team’s definition

Once defined, the team should post this definition somewhere to remind themselves what they agreed on. This could be a wiki, README in source control, or in whatever tooling is being used for work item management. For example, Azure Boards has a cool feature to specify the Definition of Done for each column on the Kanban board:

![](/content/uploads/2020/08/definition-of-done-defined.png){: .img-fluid }

Which provides a great way to remind your team to be sure all of these items are complete **before** moving something between columns.

![](/content/uploads/2020/08/move-doing-done-dod-develop.png){: .img-fluid }

In Jira, this could be done by creating a custom field with checkboxes:

![](/content/uploads/2020/08/jira-definition-of-done.png){: .img-fluid }

In GitHub, this could be defined in a README markdown file or in a repo Wiki. dwyl has a great example of this in their repo here: <https://github.com/dwyl/definition-of-done>

![](/content/uploads/2020/08/dwyl-definition-of-done-1024x840.png){: .img-fluid }

## Summary

The Definition of Done should be treated as a living document that is reviewed and updated regularly. Figure out what works best for your team and iterate on it to continuously improve. Be consistent. Be clear. Have a shared understanding.

It’s pretty clear, defining done matters. When the members of a team collectively create and understand the Definition of Done, they are likely to deliver at the highest level.