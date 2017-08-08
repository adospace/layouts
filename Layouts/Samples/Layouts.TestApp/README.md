In order to copy TypeScript files from Layouts project to Layouts.TestApp there is a small target in MSBuild (csproj definition):

'''xml
<Target Name="CopyLinkedFiles" BeforeTargets="Build">
  <ItemGroup>
    <LinkedItem Include="@(Content)" Condition="%(Content.Link) != ''" />
  </ItemGroup>
  <Copy SourceFiles="@(LinkedItem)" DestinationFiles="%(LinkedItem.Link)"/> 
</Target>
'''
